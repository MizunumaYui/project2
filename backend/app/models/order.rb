# frozen_string_literal: true

class Order < ApplicationRecord
  belongs_to :user
  has_many :order_items, dependent: :destroy

  validates :status, presence: true, inclusion: { in: %w[pending paid preparing shipped delivered cancelled] }
  validates :total_amount, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :shipping_address, presence: true

  enum status: {
    pending: "pending",
    paid: "paid",
    preparing: "preparing",
    shipped: "shipped",
    delivered: "delivered",
    cancelled: "cancelled"
  }

  scope :recent, -> { order(created_at: :desc) }

  def can_cancel?
    pending? || paid?
  end
end
