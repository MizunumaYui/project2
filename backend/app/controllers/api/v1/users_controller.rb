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

      private

      def user_params
        params.permit(:name, :email, :image_url, :password, :password_confirmation)
      end
    end
  end
end
