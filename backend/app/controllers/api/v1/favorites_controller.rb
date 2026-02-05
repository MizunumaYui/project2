# frozen_string_literal: true

module Api
  module V1
    class FavoritesController < ApplicationController
      before_action :authenticate_user!

      def index
        favorites = current_user.user_favorites.includes(:character)
        render json: UserFavoriteSerializer.new(favorites, include: [:character]).serializable_hash
      end

      def create
        character = Character.active.find(params[:character_id])
        favorite = current_user.user_favorites.build(character: character)

        if favorite.save
          render json: UserFavoriteSerializer.new(favorite, include: [:character]).serializable_hash, status: :created
        else
          render json: { errors: favorite.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        favorite = current_user.user_favorites.find(params[:id])
        favorite.destroy!
        head :no_content
      end
    end
  end
end
