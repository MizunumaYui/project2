# frozen_string_literal: true

class CartSerializer
  include JSONAPI::Serializer

  attributes :id, :created_at, :updated_at

  attribute :total_price do |cart|
    cart.total_price
  end

  attribute :total_items do |cart|
    cart.total_items
  end

  has_many :cart_items
end
