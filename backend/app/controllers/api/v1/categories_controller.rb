# frozen_string_literal: true

module Api
  module V1
    class CategoriesController < ApplicationController
      def index
        categories = Category.all
        render json: CategorySerializer.new(categories).serializable_hash
      end

      def show
        category = Category.find(params[:id])
        render json: CategorySerializer.new(category).serializable_hash
      end
    end
  end
end
