# frozen_string_literal: true

class Product < ApplicationRecord
  include MinioImageUrl

  has_one_attached :image

  belongs_to :character
  belongs_to :category, optional: true
  has_many :cart_items, dependent: :destroy
  has_many :order_items, dependent: :restrict_with_error

  validates :name, presence: true, length: { maximum: 200 }
  validates :price, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :stock, presence: true, numericality: { greater_than_or_equal_to: 0, only_integer: true }

  scope :active, -> { where(deleted_at: nil) }
  scope :in_stock, -> { where("stock > 0") }

  def image_url
    return attachment_url if image.attached?
    read_attribute(:image_url)
  end

  def attachment_url
    return nil unless image.attached? && image.persisted?
    Rails.application.routes.url_helpers.url_for(image)
  rescue => e
    Rails.logger.error "URL generation failed: #{e.message}"
    nil
  end

  def soft_delete
    update(deleted_at: Time.current)
  end

  def deleted?
    deleted_at.present?
  end

  def available?
    !deleted? && stock > 0
  end

  before_save :set_image_url

  private

  def set_image_url
    if image.attached?
      self.image_url = attachment_url
    end
  end
end
