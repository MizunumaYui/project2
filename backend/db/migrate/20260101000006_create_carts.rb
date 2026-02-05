# frozen_string_literal: true

class CreateCarts < ActiveRecord::Migration[7.1]
  def change
    create_table :carts, id: :string, primary_key: :id do |t|
      t.string :user_id, null: false

      t.timestamps
    end
  end
end
