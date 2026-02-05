# frozen_string_literal: true

require_relative "boot"

require "rails"
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "rails/test_unit/railtie"

Bundler.require(*Rails.groups)

module CharacterEcBackend
  class Application < Rails::Application
    config.load_defaults 7.1
    config.autoload_lib(ignore: %w[assets tasks])
    
    # API モード
    config.api_only = true
    
    # タイムゾーン
    config.time_zone = "Tokyo"
    config.active_record.default_timezone = :local
    
    # ロケール
    config.i18n.default_locale = :ja
    
    # 認証ジェネレーター
    config.generators do |g|
      g.test_framework :rspec
      g.fixture_replacement :factory_bot, dir: "spec/factories"
    end
  end
end
