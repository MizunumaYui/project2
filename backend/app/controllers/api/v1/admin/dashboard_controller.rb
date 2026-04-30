# frozen_string_literal: true

module Api
  module V1
    module Admin
      class DashboardController < ApplicationController
        before_action :authenticate_user!
        before_action :authorize_admin!

        def index
          render json: {
            data: {
              statistics: {
                total_users: User.count,
                total_orders: Order.count,
                total_products: Product.count,
                total_characters: Character.count,
                total_categories: Category.count,
                total_revenue: Order.sum(:total_amount),
                pending_orders: Order.where(status: "pending").count,
                recent_orders: Order.recent.limit(10).includes(:order_items).map { |o| OrderSerializer.new(o).serializable_hash[:data] }
              }
            }
          }
        end

        private

        def authorize_admin!
          render json: { error: "Admin権限が必要です" }, status: :forbidden unless current_user.admin?
        end
      end
    end
  end
end
