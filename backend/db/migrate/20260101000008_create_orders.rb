# frozen_string_literal: true

class CreateOrders < ActiveRecord::Migration[7.1]
  def change
    create_table :orders, id: :string, primary_key: :id do |t|
      t.string :user_id, null: false
      t.string :status, null: false, default: "pending"
      t.decimal :total_amount, precision: 12, scale: 2, null: false
      t.text :shipping_address, null: false

      t.timestamps
    end

    add_index :orders, :status
  end
end
