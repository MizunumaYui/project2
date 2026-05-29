# frozen_string_literal: true

require "base64"
require "json"
require "securerandom"

class MinioImageUploader
  DATA_URL_PATTERN = %r{\Adata:(?<content_type>[^;]+);base64,(?<payload>.+)\z}m
  CONTENT_TYPE_EXTENSIONS = {
    "image/jpeg" => ".jpg",
    "image/jpg" => ".jpg",
    "image/png" => ".png",
    "image/gif" => ".gif",
    "image/webp" => ".webp"
  }.freeze

  def self.upload(value, prefix:)
    return nil if value.blank?
    return value if value.is_a?(String) && value.match?(/\Ahttps?:\/\//i)
    return value unless uploadable?(value)

    new(prefix:).upload(value)
  end

  def initialize(prefix:)
    @prefix = prefix
  end

  def upload(value)
    payload = build_payload(value)
    object_key = build_object_key(payload[:filename], payload[:content_type])

    bucket = ensure_bucket!
    bucket.object(object_key).put(
      body: payload[:body],
      content_type: payload[:content_type],
      acl: "public-read"
    )

    public_url(object_key)
  end

  private

  attr_reader :prefix

  def client
    @client ||= Aws::S3::Client.new(
      endpoint: ENV.fetch("MINIO_ENDPOINT", "http://localhost:9000"),
      region: ENV.fetch("MINIO_REGION", "us-east-1"),
      access_key_id: ENV.fetch("MINIO_ROOT_USER", ENV.fetch("MINIO_ACCESS_KEY_ID", "minioadmin")),
      secret_access_key: ENV.fetch("MINIO_ROOT_PASSWORD", ENV.fetch("MINIO_SECRET_ACCESS_KEY", "minioadmin")),
      force_path_style: true,
      use_ssl: ENV.fetch("MINIO_USE_SSL", "false") == "true"
    )
  end

  def resource
    @resource ||= Aws::S3::Resource.new(client: client)
  end

  def bucket_name
    ENV.fetch("MINIO_BUCKET_NAME", "character-ec-images")
  end

  def ensure_bucket!
    bucket = resource.bucket(bucket_name)
    bucket.create unless bucket.exists?
    client.put_bucket_policy(bucket: bucket_name, policy: public_read_policy)
    bucket
  rescue Aws::S3::Errors::BucketAlreadyOwnedByYou, Aws::S3::Errors::BucketAlreadyExists
    bucket
  end

  def public_read_policy
    {
      Version: "2012-10-17",
      Statement: [
        {
          Sid: "PublicReadGetObject",
          Effect: "Allow",
          Principal: "*",
          Action: ["s3:GetObject"],
          Resource: "arn:aws:s3:::#{bucket_name}/*"
        }
      ]
    }.to_json
  end

  def build_payload(value)
    if value.respond_to?(:read)
      content_type = value.respond_to?(:content_type) && value.content_type.present? ? value.content_type : "application/octet-stream"
      filename = value.respond_to?(:original_filename) ? value.original_filename : nil

      { body: value.read, content_type: content_type, filename: filename }
    else
      match = DATA_URL_PATTERN.match(value.to_s)
      raise ArgumentError, "Unsupported image data" unless match

      {
        body: Base64.decode64(match[:payload]),
        content_type: match[:content_type],
        filename: nil
      }
    end
  end

  def self.uploadable?(value)
    value.respond_to?(:read) || value.to_s.match?(DATA_URL_PATTERN)
  end

  def build_object_key(filename, content_type)
    extension = File.extname(filename.to_s)
    extension = CONTENT_TYPE_EXTENSIONS.fetch(content_type, ".bin") if extension.blank?

    timestamp_prefix = Time.current.utc.strftime("%Y/%m/%d")
    "#{prefix}/#{timestamp_prefix}/#{SecureRandom.uuid}#{extension}"
  end

  def public_url(object_key)
    base_url = ENV.fetch("MINIO_PUBLIC_URL", ENV.fetch("MINIO_ENDPOINT", "http://localhost:9000")).to_s.chomp("/")
    "#{base_url}/#{bucket_name}/#{object_key}"
  end
end