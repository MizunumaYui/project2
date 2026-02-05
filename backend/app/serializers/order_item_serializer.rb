# frozen_string_literal: true

class OrderItemSerializer
  include JSONAPI::Serializer

  attributes :id, :quantity, :price, :created_at

  belongs_to :product
end
