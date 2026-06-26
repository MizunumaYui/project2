# frozen_string_literal: true

module Api
  module V1
    module Admin
      class ProductsController < ApplicationController
        before_action :authenticate_user!
        before_action :authorize_admin!
        before_action :set_product, only: %i[show update destroy]

        def index
          products = Product.unscoped.includes(:character, :category).page(params[:page]).per(params[:per_page] || 20)
          render json: ProductSerializer.new(products, include: [:character, :category], meta: pagination_meta(products)).serializable_hash
        end

        def show
          render json: ProductSerializer.new(@product, include: [:character, :category]).serializable_hash
        end

        def create
          product = Product.new(product_params.except(:image_file))
          product.image.attach(product_params[:image_file]) if product_params[:image_file].present?

          if product.save
            render json: ProductSerializer.new(product.reload, include: [:character, :category]).serializable_hash, status: :created
          else
            render json: { errors: product.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          @product.image.attach(product_params[:image_file]) if product_params[:image_file].present?

          if @product.update(product_params.except(:image_file))
            render json: ProductSerializer.new(@product.reload, include: [:character, :category]).serializable_hash
          else
            render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def upload_image
          @product = Product.unscoped.find(params[:id])
          image = params[:image] || params[:file]

          if image.blank?
            render json: { error: "画像ファイルが必要です" }, status: :unprocessable_entity
            return
          end

          @product.image.attach(image)
          
          if @product.update(image_url: @product.image_url)
            render json: { image_url: @product.image_url }
          else
            render json: { errors: @product.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @product.destroy
          head :no_content
        end

        private

        def set_product
          @product = Product.unscoped.find(params[:id])
        end

        def product_params
          params.permit(:character_id, :category_id, :name, :description, :price, :stock, :image_url, :image_file)
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
