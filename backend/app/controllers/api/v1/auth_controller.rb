# frozen_string_literal: true

module Api
  module V1
    class AuthController < ApplicationController
      before_action :authenticate_user!, only: %i[logout me]

      def register
        user = User.new(register_params)
        user.role = "user"

        if user.save
          token = JsonWebToken.encode(sub: user.id)
          render json: {
            user: UserSerializer.new(user).serializable_hash[:data][:attributes],
            token: token
          }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def login
        user = User.find_by(email: params[:email])

        if user&.authenticate(params[:password])
          token = JsonWebToken.encode(sub: user.id)
          render json: {
            user: UserSerializer.new(user).serializable_hash[:data][:attributes],
            token: token
          }
        else
          render json: { error: "メールアドレスまたはパスワードが正しくありません" }, status: :unauthorized
        end
      end

      def logout
        render json: { message: "ログアウトしました" }
      end

      def me
        render json: { user: UserSerializer.new(current_user).serializable_hash[:data][:attributes] }
      end

      private

      def register_params
        params.permit(:email, :password, :password_confirmation, :name)
      end
    end
  end
end
