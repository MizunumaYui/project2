# frozen_string_literal: true

class CreateCharacters < ActiveRecord::Migration[7.1]
  def change
    create_table :characters, id: :string, primary_key: :id do |t|
      t.string :name, null: false
      t.text :description
      t.string :image_url
      t.datetime :deleted_at

      t.timestamps
    end

    add_index :characters, :deleted_at
  end
end
