# frozen_string_literal: true

class User < ApplicationRecord
  has_secure_password

  has_one :cart, dependent: :destroy
  has_many :orders, dependent: :destroy
  has_many :user_favorites, dependent: :destroy
  has_many :favorite_characters, through: :user_favorites, source: :character

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true, length: { maximum: 100 }
  validates :role, presence: true, inclusion: { in: %w[user admin] }
  validates :password, presence: true, length: { minimum: 6 }, on: :create

  enum role: { user: "user", admin: "admin" }

  after_create :create_cart

  private

  def create_cart
    Cart.create!(user: self)
  end
end
