# frozen_string_literal: true

module Api
  module V1
    module Admin
      class CharactersController < ApplicationController
        before_action :authenticate_user!
        before_action :authorize_admin!
        before_action :set_character, only: %i[show update destroy upload_image]

        def index
          characters = Character.unscoped.page(params[:page]).per(params[:per_page] || 20)
          render json: CharacterSerializer.new(characters, meta: pagination_meta(characters)).serializable_hash
        end

        def show
          render json: CharacterSerializer.new(@character).serializable_hash
        end

        # キャラクター作成：データのみを扱うようにシンプル化
        def create
          character = Character.new(character_params.except(:image_file))
          
          if character.save
            render json: CharacterSerializer.new(character.reload).serializable_hash, status: :created
          else
            render json: { errors: character.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # 画像アップロード専用アクション
        def upload_image
          @character = Character.find(params[:id])
          
          if params[:file].present?
            @character.image.attach(params[:file])
            
            # ここで一度保存して、DB上で画像が紐付いた状態にする
            if @character.save
              # 保存が成功してから URL を更新する
              @character.update(image_url: @character.attachment_url)
              render json: { character: @character }
            else
              render json: { errors: @character.errors.full_messages }, status: :unprocessable_entity
            end
          end
        end
        
        def update
          if @character.update(character_params.except(:image_file))
            render json: CharacterSerializer.new(@character).serializable_hash
          else
            render json: { errors: @character.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @character.destroy
          head :no_content
        end

        private

        def set_character
          @character = Character.unscoped.find(params[:id])
        end

        def character_params
          params.permit(:name, :description, :image_url, :image_file)
        end

        def authorize_admin!
          render json: { error: "Admin権限が必要です" }, status: :forbidden unless current_user.admin?
        end

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
end