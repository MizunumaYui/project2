# frozen_string_literal: true

class Character < ApplicationRecord
  include MinioImageUrl

  has_one_attached :image
  has_many :products, dependent: :destroy
  has_many :user_favorites, dependent: :destroy
  has_many :favorited_by_users, through: :user_favorites, source: :user

  validates :name, presence: true, length: { maximum: 100 }

  scope :active, -> { where(deleted_at: nil) }

  # 💡 Userモデルの成功パターンに合わせたURL取得メソッドを追加
  def image_url
    return attachment_url if image.attached? # 画像があればActiveStorageから生成
    read_attribute(:image_url)               # なければDBカラムの値をそのまま返す
  end

  def attachment_url
    return nil unless image.attached?
    Rails.application.routes.url_helpers.url_for(image)
  end

  def soft_delete
    update(deleted_at: Time.current)
  end

  def deleted?
    deleted_at.present?
  end

  # 更新時に自動でDBのカラムを更新する仕組み
  before_save :set_image_url

  private

  def set_image_url
    # 画像が添付されていれば、最新のURLを生成してDBカラムに書き込む
    if image.attached?
      self.image_url = attachment_url
    end
  end
end