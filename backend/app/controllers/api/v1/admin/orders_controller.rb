# frozen_string_literal: true

module Api
  module V1
    module Admin
      class OrdersController < ApplicationController
        before_action :authenticate_user!
        before_action :authorize_admin!
        before_action :set_order, only: %i[show update]

        def index
          orders = Order.includes(:order_items).order(created_at: :desc).page(params[:page]).per(params[:per_page] || 20)
          render json: OrderSerializer.new(orders, include: [:order_items], meta: pagination_meta(orders)).serializable_hash
        end

        def show
          render json: OrderSerializer.new(@order, include: [:order_items]).serializable_hash
        end

        def update
          if @order.update(order_params)
            render json: OrderSerializer.new(@order, include: [:order_items]).serializable_hash
          else
            render json: { errors: @order.errors.full_messages }, status: :unprocessable_entity
          end
        end

        private

        def set_order
          @order = Order.find(params[:id])
        end

        def order_params
          params.permit(:status)
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
