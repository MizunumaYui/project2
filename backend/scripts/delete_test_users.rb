#!/usr/bin/env ruby
require_relative '../config/environment'

emails = ['test2@example.com', 'test@example.com']

emails.each do |email|
  user = User.find_by(email: email)
  if user
    puts "Found #{email} (id=#{user.id}), destroying..."
    user.destroy!
    puts "Destroyed #{email}"
  else
    puts "Not found #{email}"
  end
end
