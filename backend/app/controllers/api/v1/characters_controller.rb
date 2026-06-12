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
          image = params[:image] || params[:file]

          if image.blank?
            render json: { error: "画像ファイルが必要です" }, status: :unprocessable_entity
            return
          end

          # モデル側で定義した image.attach を実行
          @character.image.attach(image)

          # モデルの image_url メソッド経由でURLを生成してDBを更新
          if @character.update(image_url: @character.image_url)
            render json: {
              character: CharacterSerializer.new(@character).serializable_hash[:data][:attributes],
              image_url: @character.image_url
            }
          else
            render json: { errors: @character.errors.full_messages }, status: :unprocessable_entity
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