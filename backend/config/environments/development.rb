# frozen_string_literal: true

require "active_support/core_ext/integer/time"

Rails.application.configure do
  # In the development environment your application's code is reloaded any time
  # it changes.
  config.enable_reloading = true

  # Do not eager load code on boot.
  config.eager_load = false

  # Show full error reports.
  config.consider_all_requests_local = true

  # Enable server timing
  config.server_timing = true

  # Enable/disable caching.
  config.action_controller.perform_caching = false
  config.cache_store = :null_store

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise exceptions for disallowed deprecations.
  config.active_support.disallowed_deprecation = :raise

  # Tell Active Support which deprecation messages to disallow.
  config.active_support.disallowed_deprecation_warnings = []

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Highlight code that triggered database queries in logs.
  config.active_record.verbose_query_logs = true
  config.active_storage.service = :minio
  config.active_storage.resolve_model_to_route = :rails_storage_proxy

  #画像表示用（ActiveStorage）のURLをフロント（3000番）に合わせる設定
  
  if ENV['FRONTEND_URL'].present?
    # docker-compose.yml の FRONTEND_URL (http://localhost:3000) から自動抽出
    frontend_uri = URI.parse(ENV['FRONTEND_URL'])
    config.action_mailer.default_url_options = { host: frontend_uri.host, port: frontend_uri.port }
    Rails.application.routes.default_url_options = { host: "#{frontend_uri.host}:#{frontend_uri.port}" }
  else
    # 環境変数が万が一ない場合の保険設定（localhost:3000）
    config.action_mailer.default_url_options = { host: "localhost", port: 3000 }
    Rails.application.routes.default_url_options = { host: "localhost:3000" }
  end

  # ルーティングを有効化
  config.active_storage.draw_routes = true
end