# frozen_string_literal: true

class CreateProducts < ActiveRecord::Migration[7.1]
  def change
    create_table :products, id: :string, primary_key: :id do |t|
      t.string :character_id, null: false
      t.string :category_id
      t.string :name, null: false
      t.text :description
      t.decimal :price, precision: 10, scale: 2, null: false
      t.integer :stock, null: false, default: 0
      t.string :image_url
      t.datetime :deleted_at

      t.timestamps
    end

    add_index :products, :deleted_at
  end
end
