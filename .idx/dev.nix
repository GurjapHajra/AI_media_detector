{ pkgs, ... }: {

# NOTE: This is an excerpt of a complete Nix configuration example.
# For more information about the dev.nix file in IDX, see
# https://developers.google.com/idx/guides/customize-idx-env
    services.docker.enable = true;

    packages = [
        pkgs.python310
        pkgs.aws-sam-cli
        pkgs.awscli2
    ];
    env = {
        publicKey="AKIA2XS4XQBFT2EER6MO";
        privateKey="G6rQXRMSNGc/EjmXdf89g+K6b/0eViE4YPH8Gd85";
    };
# Enable previews and customize configuration
    idx.previews = {
    enable = true;
        previews = [
            # The following object sets web previews
            {
            command = [
                "npm"
                "run"
                "start"
                "--"
                "--port"
                "$PORT"
                "--host"
                "0.0.0.0"
                "--disable-host-check"
            ];
            id = "web";
            manager = "web";
            }
        ];
    };
}
