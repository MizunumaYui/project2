# frozen_string_literal: true

class Cart < ApplicationRecord
  belongs_to :user
  has_many :cart_items, dependent: :destroy
  has_many :products, through: :cart_items

  def total_price
    cart_items.includes(:product).sum { |item| item.product.price * item.quantity }
  end

  def total_items
    cart_items.sum(:quantity)
  end

  def add_item(product, quantity = 1)
    item = cart_items.find_by(product: product)
    if item
      item.update!(quantity: item.quantity + quantity)
    else
      cart_items.create!(product: product, quantity: quantity)
    end
  end

  def update_item(product, quantity)
    item = cart_items.find_by!(product: product)
    if quantity <= 0
      item.destroy!
    else
      item.update!(quantity: quantity)
    end
  end

  def remove_item(product)
    cart_items.find_by!(product: product).destroy!
  end

  def clear!
    cart_items.destroy_all
  end
end
