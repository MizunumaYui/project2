# frozen_string_literal: true

class CharacterSerializer
  include JSONAPI::Serializer

  attributes :id, :name, :description, :image_url, :created_at, :updated_at
end
