# frozen_string_literal: true

class CreateCartItems < ActiveRecord::Migration[7.1]
  def change
    create_table :cart_items, id: :string, primary_key: :id do |t|
      t.string :cart_id, null: false
      t.string :product_id, null: false
      t.integer :quantity, null: false, default: 1

      t.timestamps
    end

    add_index :cart_items, %i[cart_id product_id], unique: true
  end
end
