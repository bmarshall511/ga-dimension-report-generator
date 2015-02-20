require 'compass/import-once/activate'
# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
http_path = (environment == :production ? "../" : "../")
css_dir = (environment == :production ? "dist/assets/css" : "dev/assets/css")
sass_dir = "src/assets/scss"
images_dir = "img"
generated_images_dir = (environment == :production ? "dist/assets/img" : "dev/assets/img")
images_path =  "src/assets/img"
javascripts_dir = (environment == :production ? "dist/assets/css" : "dev/assets/js")

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed
output_style = (environment == :production ? :compressed : :expanded)

# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
# line_comments = false
line_comments = (environment == :production ? true : false)