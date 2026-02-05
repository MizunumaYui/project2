# frozen_string_literal: true

class Character < ApplicationRecord
  has_many :products, dependent: :destroy
  has_many :user_favorites, dependent: :destroy
  has_many :favorited_by_users, through: :user_favorites, source: :user

  validates :name, presence: true, length: { maximum: 100 }

  scope :active, -> { where(deleted_at: nil) }

  def soft_delete
    update(deleted_at: Time.current)
  end

  def deleted?
    deleted_at.present?
  end
end
