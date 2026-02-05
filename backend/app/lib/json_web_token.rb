# frozen_string_literal: true

class JsonWebToken
  SECRET_KEY = ENV.fetch("JWT_SECRET_KEY") { Rails.application.credentials.secret_key_base }
  EXPIRATION_TIME = ENV.fetch("JWT_EXPIRATION_HOURS") { 24 }.to_i.hours

  class << self
    def encode(payload, exp = EXPIRATION_TIME.from_now)
      payload[:exp] = exp.to_i
      payload[:iat] = Time.current.to_i
      JWT.encode(payload, SECRET_KEY, "HS256")
    end

    def decode(token)
      decoded = JWT.decode(token, SECRET_KEY, true, algorithm: "HS256")[0]
      HashWithIndifferentAccess.new(decoded)
    rescue JWT::DecodeError, JWT::ExpiredSignature
      nil
    end
  end
end
