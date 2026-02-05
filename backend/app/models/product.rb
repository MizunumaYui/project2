# frozen_string_literal: true

class Product < ApplicationRecord
  belongs_to :character
  belongs_to :category, optional: true
  has_many :cart_items, dependent: :destroy
  has_many :order_items, dependent: :restrict_with_error

  validates :name, presence: true, length: { maximum: 200 }
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :stock, presence: true, numericality: { greater_than_or_equal_to: 0, only_integer: true }

  scope :active, -> { where(deleted_at: nil) }
  scope :in_stock, -> { where("stock > 0") }

  def soft_delete
    update(deleted_at: Time.current)
  end

  def deleted?
    deleted_at.present?
  end

  def available?
    !deleted? && stock > 0
  end
end
