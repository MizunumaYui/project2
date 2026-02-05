FROM ruby:3.3.0-slim

# 必要なパッケージをインストール
RUN apt-get update -qq && \
    apt-get install -y build-essential libpq-dev nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Bundler の設定
ENV BUNDLE_PATH=/bundle \
    BUNDLE_JOBS=4

# Gemfile をコピーして依存関係をインストール
COPY Gemfile Gemfile.lock ./
RUN bundle install

# アプリケーションコードをコピー
COPY . .

# ポート公開
EXPOSE 3001

# サーバー起動
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
