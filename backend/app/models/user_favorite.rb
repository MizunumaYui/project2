# frozen_string_literal: true

class UserFavorite < ApplicationRecord
  belongs_to :user
  belongs_to :character

  validates :character_id, uniqueness: { scope: :user_id }
end
