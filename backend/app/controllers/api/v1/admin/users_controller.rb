# frozen_string_literal: true

module Api
  module V1
    module Admin
      class UsersController < ApplicationController
        before_action :authenticate_user!
        before_action :authorize_admin!
        before_action :set_user, only: %i[show]

        def index
          users = User.page(params[:page]).per(params[:per_page] || 20)
          render json: UserSerializer.new(users, meta: pagination_meta(users)).serializable_hash
        end

        def show
          render json: UserSerializer.new(@user).serializable_hash
        end

        private

        def set_user
          @user = User.find(params[:id])
        end

        def authorize_admin!
          render json: { error: "Admin権限が必要です" }, status: :forbidden unless current_user.admin?
        end

        def pagination_meta(collection)
          {
            current_page: collection.current_page,
            total_pages: collection.total_pages,
            total_count: collection.total_count
          }
        end
      end
    end
  end
end
