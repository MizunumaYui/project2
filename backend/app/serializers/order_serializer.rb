# frozen_string_literal: true

class OrderSerializer
  include JSONAPI::Serializer

  attributes :id, :status, :total_amount, :shipping_address, :created_at, :updated_at

  belongs_to :user
  has_many :order_items
end
