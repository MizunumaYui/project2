# frozen_string_literal: true

# 初期データ投入

# 管理者ユーザー
admin = User.find_or_create_by!(email: "admin@example.com") do |user|
  user.name = "管理者"
  user.password = "password123"
  user.password_confirmation = "password123"
  user.role = "admin"
end

puts "Created admin user: #{admin.email}"

# テストユーザー
test_user = User.find_or_create_by!(email: "user@example.com") do |user|
  user.name = "テストユーザー"
  user.password = "password123"
  user.password_confirmation = "password123"
  user.role = "user"
end

puts "Created test user: #{test_user.email}"

# カテゴリ
categories = [
  { name: "フィギュア", description: "キャラクターフィギュア" },
  { name: "アクリルスタンド", description: "アクリルスタンド・アクリルキーホルダー" },
  { name: "ぬいぐるみ", description: "ぬいぐるみ・クッション" },
  { name: "文具", description: "ノート・ペン・シール等" },
  { name: "アパレル", description: "Tシャツ・パーカー等" },
  { name: "雑貨", description: "その他雑貨" }
]

categories.each do |cat_attrs|
  Category.find_or_create_by!(name: cat_attrs[:name]) do |cat|
    cat.description = cat_attrs[:description]
  end
end

puts "Created #{Category.count} categories"

# サンプルキャラクター
characters = [
  { name: "キャラクターA", description: "元気で明るいキャラクター" },
  { name: "キャラクターB", description: "クールで知的なキャラクター" },
  { name: "キャラクターC", description: "優しくて癒し系のキャラクター" }
]

characters.each do |char_attrs|
  Character.find_or_create_by!(name: char_attrs[:name]) do |char|
    char.description = char_attrs[:description]
  end
end

puts "Created #{Character.count} characters"

# サンプル商品
if Product.count.zero?
  Character.all.each do |character|
    Category.all.each do |category|
      Product.create!(
        character: character,
        category: category,
        name: "#{character.name} #{category.name}",
        description: "#{character.name}の#{category.name}です。",
        price: rand(1000..5000),
        stock: rand(10..100)
      )
    end
  end
  puts "Created #{Product.count} products"
end
