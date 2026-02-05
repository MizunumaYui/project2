# frozen_string_literal: true

class UserFavoriteSerializer
  include JSONAPI::Serializer

  attributes :id, :created_at

  belongs_to :character
end
