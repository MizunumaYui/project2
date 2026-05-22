#!/usr/bin/env ruby
require_relative '../config/environment'

users = User.where("email LIKE ?", "%test%")

if users.empty?
  puts 'No users with test in email'
else
  users.find_each do |user|
    puts "#{user.id}: #{user.email}"
  end
end
