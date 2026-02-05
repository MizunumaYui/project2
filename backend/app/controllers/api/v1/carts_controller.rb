# frozen_string_literal: true

module Api
  module V1
    class CartsController < ApplicationController
      before_action :authenticate_user!

      def show
        render json: CartSerializer.new(current_user.cart, include: [:cart_items]).serializable_hash
      end

      def add_item
        product = Product.active.find(params[:product_id])
        quantity = params[:quantity].to_i || 1

        current_user.cart.add_item(product, quantity)
        render json: CartSerializer.new(current_user.cart.reload, include: [:cart_items]).serializable_hash
      end

      def update_item
        product = Product.find(params[:product_id])
        quantity = params[:quantity].to_i

        current_user.cart.update_item(product, quantity)
        render json: CartSerializer.new(current_user.cart.reload, include: [:cart_items]).serializable_hash
      end

      def remove_item
        product = Product.find(params[:product_id])
        current_user.cart.remove_item(product)
        render json: CartSerializer.new(current_user.cart.reload, include: [:cart_items]).serializable_hash
      end

      def clear
        current_user.cart.clear!
        render json: CartSerializer.new(current_user.cart.reload, include: [:cart_items]).serializable_hash
      end
    end
  end
end
