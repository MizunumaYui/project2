# frozen_string_literal: true

class OrderService
  def initialize(user)
    @user = user
    @cart = user.cart
  end

  def create_order(params)
    return { success: false, errors: ["カートが空です"] } if @cart.cart_items.empty?

    ActiveRecord::Base.transaction do
      order = build_order(params)
      add_items_to_order(order)
      validate_stock(order)
      deduct_stock(order)
      order.save!
      @cart.clear!

      { success: true, order: order }
    end
  rescue ActiveRecord::RecordInvalid => e
    { success: false, errors: e.record.errors.full_messages }
  rescue StandardError => e
    { success: false, errors: [e.message] }
  end

  private

  def build_order(params)
    @user.orders.build(
      status: "pending",
      total_amount: @cart.total_price,
      shipping_address: params[:shipping_address]
    )
  end

  def add_items_to_order(order)
    @cart.cart_items.includes(:product).each do |cart_item|
      order.order_items.build(
        product: cart_item.product,
        quantity: cart_item.quantity,
        price: cart_item.product.price
      )
    end
  end

  def validate_stock(order)
    order.order_items.each do |item|
      if item.product.stock < item.quantity
        raise StandardError, "#{item.product.name}の在庫が不足しています"
      end
    end
  end

  def deduct_stock(order)
    order.order_items.each do |item|
      item.product.update!(stock: item.product.stock - item.quantity)
    end
  end
end
