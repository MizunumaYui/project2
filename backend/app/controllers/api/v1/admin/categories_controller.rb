# frozen_string_literal: true

module Api
  module V1
    module Admin
      class CategoriesController < ApplicationController
        before_action :authenticate_user!
        before_action :authorize_admin!
        before_action :set_category, only: %i[show update destroy]

        def index
          categories = Category.page(params[:page]).per(params[:per_page] || 20)
          render json: CategorySerializer.new(categories, meta: pagination_meta(categories)).serializable_hash
        end

        def show
          render json: CategorySerializer.new(@category).serializable_hash
        end

        def create
          category = Category.new(category_params)

          if category.save
            render json: CategorySerializer.new(category).serializable_hash, status: :created
          else
            render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          if @category.update(category_params)
            render json: CategorySerializer.new(@category).serializable_hash
          else
            render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @category.destroy
          head :no_content
        end

        private

        def set_category
          @category = Category.find(params[:id])
        end

        def category_params
          params.permit(:name, :description)
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
