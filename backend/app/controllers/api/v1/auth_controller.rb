# frozen_string_literal: true

module Api
  module V1
    class AuthController < ApplicationController
      before_action :authenticate_user!, only: %i[logout me]

      def register
        user = User.new(register_params)
        user.role = "user"

        if user.save
          access_token = JsonWebToken.encode({ sub: user.id, typ: 'access' }, 15.minutes.from_now)
          refresh_token = JsonWebToken.encode({ sub: user.id, typ: 'refresh' }, 7.days.from_now)

          cookies[:refresh_token] = {
            value: refresh_token,
            httponly: true,
            secure: Rails.env.production?,
            same_site: :lax,
            path: '/'
          }

          render json: {
            user: UserSerializer.new(user).serializable_hash[:data][:attributes],
            token: access_token
          }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def login
        user = User.find_by(email: params[:email])

        if user&.authenticate(params[:password])
          access_token = JsonWebToken.encode({ sub: user.id, typ: 'access' }, 15.minutes.from_now)
          refresh_token = JsonWebToken.encode({ sub: user.id, typ: 'refresh' }, 7.days.from_now)

          cookies[:refresh_token] = {
            value: refresh_token,
            httponly: true,
            secure: Rails.env.production?,
            same_site: :lax,
            path: '/'
          }

          render json: {
            user: UserSerializer.new(user).serializable_hash[:data][:attributes],
            token: access_token
          }
        else
          render json: { error: "メールアドレスまたはパスワードが正しくありません" }, status: :unauthorized
        end
      end

      def refresh
        token = cookies[:refresh_token]
        return render(json: { error: 'リフレッシュトークンがありません' }, status: :unauthorized) unless token

        payload = JsonWebToken.decode(token)
        return render(json: { error: '無効なトークンです' }, status: :unauthorized) unless payload && payload[:typ] == 'refresh'

        user = User.find_by(id: payload[:sub])
        return render(json: { error: 'ユーザーが見つかりません' }, status: :unauthorized) unless user

        access_token = JsonWebToken.encode({ sub: user.id, typ: 'access' }, 15.minutes.from_now)
        # リフレッシュトークンをローテーションして更新
        new_refresh_token = JsonWebToken.encode({ sub: user.id, typ: 'refresh' }, 7.days.from_now)
        cookies[:refresh_token] = {
          value: new_refresh_token,
          httponly: true,
          secure: Rails.env.production?,
          same_site: :lax,
          path: '/'
        }

        render json: { user: UserSerializer.new(user).serializable_hash[:data][:attributes], token: access_token }
      end

      def logout
        cookies.delete(:refresh_token, path: '/')
        render json: { message: "ログアウトしました" }
      end

      def me
        render json: { user: UserSerializer.new(current_user).serializable_hash[:data][:attributes] }
      end

      private

      def register_params
        params.permit(:email, :password, :password_confirmation, :name, :image_url)
      end
    end
  end
end
