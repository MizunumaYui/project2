# frozen_string_literal: true

module Api
  module V1
    class CharactersController < ApplicationController
      def index
        characters = Character.active.page(params[:page]).per(params[:per_page] || 20)
        render json: CharacterSerializer.new(characters, meta: pagination_meta(characters)).serializable_hash
      end

      def show
        character = Character.active.find(params[:id])
        render json: CharacterSerializer.new(character).serializable_hash
      end

      private

      def pagination_meta(collection)
        {
          current_page: collection.current_page,
          total_pages: collection.total_pages,
          total_count: collection.total_count
        }
      end
    end
  end
end
