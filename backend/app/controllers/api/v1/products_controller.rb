# frozen_string_literal: true

module Api
  module V1
    class ProductsController < ApplicationController
      def index
        products = Product.active.includes(:character, :category)
        products = products.where(character_id: params[:character_id]) if params[:character_id].present?
        products = products.where(category_id: params[:category_id]) if params[:category_id].present?
        products = products.page(params[:page]).per(params[:per_page] || 20)

        render json: ProductSerializer.new(products, include: [:character, :category], meta: pagination_meta(products)).serializable_hash
      end

      def show
        product = Product.active.includes(:character, :category).find(params[:id])
        render json: ProductSerializer.new(product, include: [:character, :category]).serializable_hash
      end

      private

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
