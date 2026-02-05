# frozen_string_literal: true

class ProductSerializer
  include JSONAPI::Serializer

  attributes :id, :name, :description, :price, :stock, :image_url, :created_at, :updated_at

  belongs_to :character
  belongs_to :category
end
