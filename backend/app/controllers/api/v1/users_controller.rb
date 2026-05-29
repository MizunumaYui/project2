# frozen_string_literal: true

module Api
  module V1
    class UsersController < ApplicationController
      before_action :authenticate_user!

      def update
        if current_user.update(user_params)
          render json: { user: UserSerializer.new(current_user).serializable_hash[:data][:attributes] }
        else
          render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def upload_image
        image = params[:image] || params[:file]

        if image.blank?
          render json: { error: "画像ファイルが必要です" }, status: :unprocessable_entity
          return
        end

        current_user.profile_image.attach(image)

        if current_user.update(image_url: current_user.profile_image_url)
          render json: {
            user: UserSerializer.new(current_user).serializable_hash[:data][:attributes],
            image_url: current_user.image_url
          }
        else
          render json: { errors: current_user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def user_params
        params.permit(:name, :email, :image_url, :password, :password_confirmation)
      end
    end
  end
end
