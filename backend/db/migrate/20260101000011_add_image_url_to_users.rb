# frozen_string_literal: true

class AddImageUrlToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :image_url, :text
  end
end
