# frozen_string_literal: true

class ApplicationController < ActionController::API
  include Pundit::Authorization

  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity
  rescue_from Pundit::NotAuthorizedError, with: :forbidden

  private

  def current_user
    @current_user ||= authenticate_user
  end

  def authenticate_user
    header = request.headers["Authorization"]
    return nil unless header

    token = header.split(" ").last
    decoded = JsonWebToken.decode(token)
    return nil unless decoded

    User.find_by(id: decoded[:sub])
  rescue JWT::DecodeError
    nil
  end

  def authenticate_user!
    render json: { error: "認証が必要です" }, status: :unauthorized unless current_user
  end

  def not_found
    render json: { error: "リソースが見つかりません" }, status: :not_found
  end

  def unprocessable_entity(exception)
    render json: { error: exception.record.errors.full_messages }, status: :unprocessable_entity
  end

  def forbidden
    render json: { error: "この操作を行う権限がありません" }, status: :forbidden
  end
end
