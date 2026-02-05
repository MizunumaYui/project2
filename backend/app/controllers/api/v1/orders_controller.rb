# frozen_string_literal: true

module Api
  module V1
    class OrdersController < ApplicationController
      before_action :authenticate_user!

      def index
        orders = current_user.orders.recent.includes(:order_items).page(params[:page]).per(params[:per_page] || 10)
        render json: OrderSerializer.new(orders, include: [:order_items], meta: pagination_meta(orders)).serializable_hash
      end

      def show
        order = current_user.orders.find(params[:id])
        render json: OrderSerializer.new(order, include: [:order_items]).serializable_hash
      end

      def create
        result = OrderService.new(current_user).create_order(order_params)

        if result[:success]
          render json: OrderSerializer.new(result[:order], include: [:order_items]).serializable_hash, status: :created
        else
          render json: { errors: result[:errors] }, status: :unprocessable_entity
        end
      end

      private

      def order_params
        params.permit(:shipping_address)
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
