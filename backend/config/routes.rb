# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # 認証
      post "auth/register", to: "auth#register"
      post "auth/login", to: "auth#login"
      delete "auth/logout", to: "auth#logout"
      get "auth/me", to: "auth#me"

      # キャラクター
      resources :characters, only: %i[index show] do
        resources :products, only: %i[index], module: :characters
      end

      # カテゴリ
      resources :categories, only: %i[index show]

      # 商品
      resources :products, only: %i[index show]

      # カート
      resource :cart, only: %i[show] do
        post :add_item
        patch :update_item
        delete :remove_item
        delete :clear
      end

      # 注文
      resources :orders, only: %i[index show create]

      # お気に入り
      resources :favorites, only: %i[index create destroy]

      # 管理者用API
      namespace :admin do
        resources :characters
        resources :categories
        resources :products
        resources :orders, only: %i[index show update]
        resources :users, only: %i[index show]
        get :dashboard, to: "dashboard#index"
      end
    end
  end

  # ヘルスチェック
  get "up" => "rails/health#show", as: :rails_health_check
end
