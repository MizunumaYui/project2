# frozen_string_literal: true

class CartItemSerializer
  include JSONAPI::Serializer

  attributes :id, :quantity, :created_at

  belongs_to :product
end
