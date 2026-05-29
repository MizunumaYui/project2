# frozen_string_literal: true

module MinioImageUrl
  def image_url=(value)
    super(MinioImageUploader.upload(value, prefix: self.class.name.underscore))
  end
end