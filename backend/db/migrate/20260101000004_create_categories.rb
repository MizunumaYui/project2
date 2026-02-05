# frozen_string_literal: true

class CreateCategories < ActiveRecord::Migration[7.1]
  def change
    create_table :categories, id: :string, primary_key: :id do |t|
      t.string :name, null: false
      t.text :description

      t.timestamps
    end
  end
end
