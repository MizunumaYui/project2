# frozen_string_literal: true

class CreateUserFavorites < ActiveRecord::Migration[7.1]
  def change
    create_table :user_favorites, id: :string, primary_key: :id do |t|
      t.string :user_id, null: false
      t.string :character_id, null: false

      t.timestamps
    end

    add_index :user_favorites, %i[user_id character_id], unique: true
  end
end
