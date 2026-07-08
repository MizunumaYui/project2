# frozen_string_literal: true

module Api
  module V1
    class ProductsController < ApplicationController
      def index
        products = Product.active.includes(:character, :category)
        products = products.where(character_id: params[:character_id]) if params[:character_id].present?
        products = products.where(category_id: params[:category_id]) if params[:category_id].present?
        products = products.where(categories: { name: params[:category] }) if params[:category].present?
        
        # 検索キーワードによるフィルタリング
        if params[:q].present?
          search_term = "%#{params[:q]}%"
          products = products.where(
            "products.name LIKE ? OR products.description LIKE ? OR characters.name LIKE ? OR categories.name LIKE ?",
            search_term, search_term, search_term, search_term
          )
        end
        
        # 価格範囲によるフィルタリング
        if params[:price].present?
          price_param = params[:price]
          if price_param.include?('+')
            min_price = price_param.gsub('+', '').to_i
            products = products.where("products.price >= ?", min_price) if min_price > 0
          elsif price_param.include?('-')
            min_price, max_price = price_param.split('-')
            products = products.where("products.price >= ? AND products.price <= ?", min_price.to_i, max_price.to_i)
          else
            min_price = price_param.to_i
            products = products.where("products.price >= ?", min_price) if min_price > 0
          end
        end
        
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
